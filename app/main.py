from fastapi import FastAPI

from app.database import engine, Base
from app.routers import registrations
from app.reminders import start_scheduler

app = FastAPI(title="eventoo - Registrations Module")

app.include_router(registrations.router)


@app.on_event("startup")
def on_startup():
    # For local/dev only — use Alembic migrations in the real project instead of create_all.
    Base.metadata.create_all(bind=engine)
    start_scheduler()


@app.get("/health")
def health():
    return {"status": "ok"}
