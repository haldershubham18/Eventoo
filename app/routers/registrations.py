from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func

from app.database import get_db
from app.models import Event, Student, Registration, TeamMember, RegistrationStatus, PaymentStatus
from app.schemas import RegistrationCreate, RegistrationOut, PaymentUploadOut
from app.cloudinary_utils import upload_payment_screenshot

router = APIRouter(tags=["registrations"])


# TODO: replace with your real auth dependency (e.g. decode JWT -> Student)
def get_current_student(db: Session = Depends(get_db)) -> Student:
    student = db.query(Student).first()
    if not student:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return student


@router.post("/events/{event_id}/register", response_model=RegistrationOut, status_code=201)
def register_for_event(
    event_id: str,
    payload: RegistrationCreate,
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    # Lock the event row so two simultaneous requests can't both slip past
    # the capacity check and overfill the event (classic race condition).
    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .with_for_update()
        .first()
    )
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if datetime.utcnow() > event.registration_deadline:
        raise HTTPException(status_code=400, detail="Registration deadline has passed")

    already = (
        db.query(Registration)
        .filter(Registration.event_id == event_id, Registration.student_id == current_student.id)
        .first()
    )
    if already:
        raise HTTPException(status_code=400, detail="You're already registered for this event")

    team_size = 1 + len(payload.members)

    if not event.is_team_event:
        if payload.members:
            raise HTTPException(status_code=400, detail="This is a solo event, don't send team members")
        team_size = 1
    else:
        if not payload.team_name:
            raise HTTPException(status_code=400, detail="team_name is required for team events")
        if not (event.min_team_size <= team_size <= event.max_team_size):
            raise HTTPException(
                status_code=400,
                detail=f"Team size must be between {event.min_team_size} and {event.max_team_size} "
                       f"(including you). You sent {team_size}.",
            )
        member_emails = {m.email.lower() for m in payload.members} | {current_student.email.lower()}
        if len(member_emails) != team_size:
            raise HTTPException(status_code=400, detail="A team member email matches your own")

    # capacity check — counts individual students already registered, not rows
    current_headcount = (
        db.query(func.count(TeamMember.id))
        .join(Registration)
        .filter(Registration.event_id == event_id, Registration.status != RegistrationStatus.CANCELLED)
        .scalar()
    ) or 0
    current_headcount += (
        db.query(func.count(Registration.id))
        .filter(Registration.event_id == event_id, Registration.status != RegistrationStatus.CANCELLED)
        .scalar()
    ) or 0  # +1 per registration for the leader

    if current_headcount + team_size > event.max_participants:
        remaining = max(event.max_participants - current_headcount, 0)
        raise HTTPException(
            status_code=409,
            detail=f"Event is full or doesn't have enough spots left (only {remaining} spot(s) remaining)",
        )

    registration = Registration(
        event_id=event_id,
        student_id=current_student.id,
        team_name=payload.team_name,
        status=RegistrationStatus.PENDING_PAYMENT,
    )
    db.add(registration)
    db.flush()  # get registration.id before adding members

    for m in payload.members:
        db.add(TeamMember(
            registration_id=registration.id,
            name=m.name,
            email=m.email,
            roll_number=m.roll_number,
            phone=m.phone,
        ))

    db.commit()
    db.refresh(registration)
    return registration


@router.post("/registrations/{registration_id}/payment", response_model=PaymentUploadOut)
async def upload_payment(
    registration_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    registration = db.query(Registration).filter(Registration.id == registration_id).first()
    if not registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    if registration.student_id != current_student.id:
        raise HTTPException(status_code=403, detail="Not your registration")
    if registration.status == RegistrationStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Registration is cancelled")

    result = await upload_payment_screenshot(file, registration_id)

    registration.payment_screenshot_url = result["url"]
    registration.payment_screenshot_public_id = result["public_id"]
    registration.payment_status = PaymentStatus.UNDER_REVIEW
    db.commit()
    db.refresh(registration)

    return PaymentUploadOut(
        registration_id=registration.id,
        payment_screenshot_url=registration.payment_screenshot_url,
        payment_status=registration.payment_status,
    )


@router.get("/students/me/registrations", response_model=list[RegistrationOut])
def my_registrations(
    db: Session = Depends(get_db),
    current_student: Student = Depends(get_current_student),
):
    return (
        db.query(Registration)
        .options(joinedload(Registration.team_members))
        .filter(Registration.student_id == current_student.id)
        .order_by(Registration.created_at.desc())
        .all()
    )
