from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models import RegistrationStatus, PaymentStatus


# ---------- Request schemas ----------

class TeamMemberIn(BaseModel):
    name: str
    email: EmailStr
    roll_number: Optional[str] = None
    phone: Optional[str] = None


class RegistrationCreate(BaseModel):
    team_name: Optional[str] = None
    members: List[TeamMemberIn] = Field(default_factory=list)  # extra members, NOT including the leader

    @field_validator("members")
    @classmethod
    def no_duplicate_emails(cls, members):
        emails = [m.email.lower() for m in members]
        if len(emails) != len(set(emails)):
            raise ValueError("Duplicate team member emails in request")
        return members


# ---------- Response schemas ----------

class TeamMemberOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    roll_number: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True


class RegistrationOut(BaseModel):
    id: str
    event_id: str
    student_id: str
    team_name: Optional[str] = None
    status: RegistrationStatus
    payment_status: PaymentStatus
    payment_screenshot_url: Optional[str] = None
    created_at: datetime
    team_members: List[TeamMemberOut] = []

    class Config:
        from_attributes = True


class PaymentUploadOut(BaseModel):
    registration_id: str
    payment_screenshot_url: str
    payment_status: PaymentStatus
