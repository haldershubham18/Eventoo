"""
Daily reminder job — runs once a day, finds events happening tomorrow,
and emails every confirmed registrant (leader + team members).

Install: pip install apscheduler

Wire it up in main.py with:
    from app.reminders import start_scheduler
    start_scheduler()
"""
import logging
import os
import smtplib
from datetime import datetime, timedelta, time
from email.message import EmailMessage

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import and_

from app.database import SessionLocal
from app.models import Event, Registration, RegistrationStatus

logger = logging.getLogger("reminders")

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")


def send_email(to_email: str, subject: str, body: str) -> None:
    if not SMTP_USER or not SMTP_PASSWORD:
        # No SMTP creds configured yet — log instead of crashing the job.
        logger.warning("SMTP not configured, would have emailed %s: %s", to_email, subject)
        return

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = SMTP_USER
    msg["To"] = to_email
    msg.set_content(body)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
    except Exception:
        logger.exception("Failed to send reminder email to %s", to_email)


def send_reminders_for_tomorrows_events() -> None:
    """The actual job. Pulls every event happening tomorrow and emails
    every confirmed registrant + their team members."""
    db = SessionLocal()
    try:
        tomorrow = datetime.utcnow().date() + timedelta(days=1)
        day_start = datetime.combine(tomorrow, time.min)
        day_end = datetime.combine(tomorrow, time.max)

        events_tomorrow = (
            db.query(Event)
            .filter(and_(Event.event_date >= day_start, Event.event_date <= day_end))
            .all()
        )

        if not events_tomorrow:
            logger.info("No events tomorrow, nothing to remind.")
            return

        for event in events_tomorrow:
            registrations = (
                db.query(Registration)
                .filter(
                    Registration.event_id == event.id,
                    Registration.status == RegistrationStatus.CONFIRMED,
                )
                .all()
            )

            for reg in registrations:
                recipients = [(reg.student.name, reg.student.email)]
                recipients += [(m.name, m.email) for m in reg.team_members]

                for name, email in recipients:
                    subject = f"Reminder: {event.title} is tomorrow!"
                    body = (
                        f"Hey {name},\n\n"
                        f"Just a reminder that \"{event.title}\" is happening tomorrow "
                        f"({event.event_date.strftime('%b %d, %Y at %I:%M %p')}).\n\n"
                        f"See you there!"
                    )
                    send_email(email, subject, body)

            logger.info("Sent reminders for event %s to %d registration(s)", event.title, len(registrations))

    finally:
        db.close()


_scheduler = None


def start_scheduler():
    """Call this once, at app startup (e.g. in main.py's startup event)."""
    global _scheduler
    if _scheduler is not None:
        return _scheduler  # already running

    _scheduler = BackgroundScheduler(timezone="UTC")
    # Runs daily at 09:00 UTC — adjust the hour to whenever makes sense for your users' timezone.
    _scheduler.add_job(
        send_reminders_for_tomorrows_events,
        trigger=CronTrigger(hour=9, minute=0),
        id="daily_event_reminders",
        replace_existing=True,
    )
    _scheduler.start()
    logger.info("Reminder scheduler started.")
    return _scheduler
