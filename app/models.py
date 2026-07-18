"""
Models for the registrations module.

NOTE: `Event` and `Student` below are minimal stand-ins so this file runs
on its own. When you merge this into the main schema, delete these two
and point the ForeignKeys at your real `events` / `users` tables instead —
just keep the column names (`event_id`, `student_id`) the same so nothing
else in this module needs to change.
"""
import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, ForeignKey, Enum, Text, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class RegistrationStatus(str, enum.Enum):
    PENDING_PAYMENT = "pending_payment"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class PaymentStatus(str, enum.Enum):
    NOT_SUBMITTED = "not_submitted"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"


# ---------------------------------------------------------------------
# Stand-in tables (replace with your real Event / Student models)
# ---------------------------------------------------------------------

class Event(Base):
    __tablename__ = "events"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    is_team_event = Column(Boolean, default=False, nullable=False)
    min_team_size = Column(Integer, default=1, nullable=False)
    max_team_size = Column(Integer, default=1, nullable=False)
    max_participants = Column(Integer, nullable=False)  # capacity, in students (not teams)
    registration_deadline = Column(DateTime, nullable=False)
    event_date = Column(DateTime, nullable=False)

    registrations = relationship("Registration", back_populates="event")


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)


# ---------------------------------------------------------------------
# Core registration tables
# ---------------------------------------------------------------------

class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (
        UniqueConstraint("event_id", "student_id", name="uq_one_registration_per_student_per_event"),
    )

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    event_id = Column(UUID(as_uuid=False), ForeignKey("events.id"), nullable=False)
    student_id = Column(UUID(as_uuid=False), ForeignKey("students.id"), nullable=False)  # the person who registered (team leader, if team)

    team_name = Column(String(255), nullable=True)  # null for solo registrations
    status = Column(Enum(RegistrationStatus), default=RegistrationStatus.PENDING_PAYMENT, nullable=False)

    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.NOT_SUBMITTED, nullable=False)
    payment_screenshot_url = Column(String(500), nullable=True)
    payment_screenshot_public_id = Column(String(255), nullable=True)  # cloudinary public_id, for deletes/replaces

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    event = relationship("Event", back_populates="registrations")
    student = relationship("Student")
    team_members = relationship("TeamMember", back_populates="registration", cascade="all, delete-orphan")

    @property
    def team_size(self):
        # +1 for the leader, who registered but isn't stored as a TeamMember row
        return 1 + len(self.team_members)


class TeamMember(Base):
    """Extra members on a team registration. The registering student (leader)
    is stored on Registration.student_id, NOT duplicated here."""
    __tablename__ = "team_members"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    registration_id = Column(UUID(as_uuid=False), ForeignKey("registrations.id"), nullable=False)

    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    roll_number = Column(String(50), nullable=True)
    phone = Column(String(20), nullable=True)

    registration = relationship("Registration", back_populates="team_members")
