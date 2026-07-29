import React, { useState, useMemo, useRef } from "react";
import { BRAND, SEED_EVENTS, OTHER_LEADERS, CATEGORY_STYLE } from "./data/seed";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import BottomNav from "./components/layout/BottomNav";
import Toast from "./components/ui/Toast";

import HomeTab from "./components/tabs/HomeTab";
import EventsTab from "./components/tabs/EventsTab";
import AttendanceTab from "./components/tabs/AttendanceTab";
import CertificatesTab from "./components/tabs/CertificatesTab";
import ProfileTab from "./components/tabs/ProfileTab";

import EventDetailOverlay from "./components/overlays/EventDetailOverlay";
import PaymentOverlay from "./components/overlays/PaymentOverlay";
import RewardsOverlay from "./components/overlays/RewardsOverlay";
import AddCertOverlay from "./components/overlays/AddCertOverlay";
import CertDetailOverlay from "./components/overlays/CertDetailOverlay";

import LoginPage from "./components/auth/LoginPage";
import SignUpPage from "./components/auth/SignUpPage";
import { getCurrentUser, logoutUser } from "./lib/auth";

export default function CampusConnectApp() {
  const [user, setUser] = useState(() => getCurrentUser());
  const [authView, setAuthView] = useState("login"); // "login" | "signup"
  const [tab, setTab] = useState("home");
  const [events, setEvents] = useState(SEED_EVENTS);
  const [registeredIds, setRegisteredIds] = useState(["ai-ethics"]);
  const [attendedIds, setAttendedIds] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [pointsLog, setPointsLog] = useState([
    { label: "Welcome bonus", points: 50, date: "Sep 1" },
  ]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [detailEvent, setDetailEvent] = useState(null);
  const [payFlow, setPayFlow] = useState(null);
  const [showRewards, setShowRewards] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);
  const [certDetail, setCertDetail] = useState(null);
  const [profileSubTab, setProfileSubTab] = useState("certificates");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const points = useMemo(() => pointsLog.reduce((s, p) => s + p.points, 0), [pointsLog]);

  const leaderboard = useMemo(() => {
    const all = [...OTHER_LEADERS, { name: "You", points, isMe: true }];
    all.sort((a, b) => b.points - a.points);
    return all;
  }, [points]);

  const myRank = leaderboard.findIndex((l) => l.isMe) + 1;
  const badgeState = { registeredIds, attendedIds, certificates, rank: myRank };
  const categories = ["All", ...Object.keys(CATEGORY_STYLE)];

  const filteredEvents = events.filter((e) => {
    const matchesCat = category === "All" || e.category === category;
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.org.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const registeredEvents = events.filter((e) => registeredIds.includes(e.id));
  const upcomingToAttend = registeredEvents.filter((e) => !attendedIds.includes(e.id));
  const attendedEvents = events.filter((e) => attendedIds.includes(e.id));

  function registerEvent(ev) {
    if (registeredIds.includes(ev.id)) return;
    if (ev.fee > 0) {
      setPayFlow(ev);
    } else {
      completeRegistration(ev);
    }
  }

  function completeRegistration(ev) {
    setRegisteredIds((ids) => [...ids, ev.id]);
    setPointsLog((log) => [...log, { label: `Registered: ${ev.title}`, points: 10, date: "Today" }]);
    setEvents((evs) => evs.map((e) => (e.id === ev.id ? { ...e, seatsLeft: Math.max(0, e.seatsLeft - 1) } : e)));
    showToast(`Registered for ${ev.title}`);
    setDetailEvent(null);
    setPayFlow(null);
  }

  function simulateScan() {
    const next = upcomingToAttend[0];
    if (!next) {
      showToast("No events awaiting check-in");
      return;
    }
    setAttendedIds((ids) => [...ids, next.id]);
    setPointsLog((log) => [...log, { label: `Attended: ${next.title}`, points: next.points, date: "Today" }]);
    if (next.certificateEligible) {
      setCertificates((c) => [
        ...c,
        { id: next.id, title: next.title, category: next.category, date: next.date, verifiedBy: next.org, external: false },
      ]);
      setPointsLog((log) => [...log, { label: `Certificate bonus: ${next.title}`, points: 50, date: "Today" }]);
    }
    showToast(`Checked in to ${next.title}!`);
  }

  function addExternalCertificate(title, cat, date) {
    setCertificates((c) => [
      ...c,
      { id: `ext-${Date.now()}`, title, category: cat, date, verifiedBy: "Pending verification", external: true },
    ]);
    showToast("Certificate submitted for verification");
    setShowAddCert(false);
  }

  function signOut() {
    if (!window.confirm("Sign out of CampusConnect?")) return;
    logoutUser();
    setUser(null);
    setAuthView("login");
    setTab("home");
    setRegisteredIds([]);
    setAttendedIds([]);
    setCertificates([]);
    setPointsLog([{ label: "Welcome bonus", points: 50, date: "Sep 1" }]);
    showToast("Signed out");
  }

  // Gate the app behind auth. Both pages share the same brand shell,
  // styling, and validation approach as the rest of the product.
  if (!user) {
    return authView === "signup" ? (
      <SignUpPage
        onSignUp={(session) => {
          setUser(session);
          setAuthView("login");
        }}
        onNavigateLogin={() => setAuthView("login")}
      />
    ) : (
      <LoginPage
        onLogin={(session) => setUser(session)}
        onNavigateSignUp={() => setAuthView("signup")}
      />
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: `linear-gradient(180deg, ${BRAND.paperDim}, #EDE6F9)` }}>
      <div className="mx-auto flex" style={{ maxWidth: 1440 }}>
        <Sidebar
          tab={tab}
          setTab={setTab}
          points={points}
          rank={myRank}
          onOpenRewards={() => setShowRewards(true)}
          onSignOut={signOut}
        />

        <div
          className="relative flex-1 flex flex-col min-h-screen w-full max-w-[460px] lg:max-w-none mx-auto lg:mx-0 shadow-2xl lg:shadow-none"
          style={{ background: BRAND.paper }}
        >
          <Header onSearchClick={() => setTab("events")} name={user.name?.split(" ")[0] || "there"} />

          <main className="flex-1 overflow-y-auto pb-24 lg:pb-8 w-full lg:max-w-6xl lg:mx-auto" style={{ WebkitOverflowScrolling: "touch" }}>
            {tab === "home" && (
              <HomeTab
                events={events}
                points={points}
                rank={myRank}
                registeredIds={registeredIds}
                category={category}
                setCategory={(c) => { setCategory(c); setTab("events"); }}
                onOpenEvent={setDetailEvent}
                onOpenRewards={() => setShowRewards(true)}
              />
            )}

            {tab === "events" && (
              <EventsTab
                events={filteredEvents}
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
                categories={categories}
                registeredIds={registeredIds}
                onOpenEvent={setDetailEvent}
                onRegister={registerEvent}
              />
            )}

            {tab === "attendance" && (
              <AttendanceTab
                upcoming={upcomingToAttend}
                attended={attendedEvents}
                onScan={simulateScan}
                points={points}
                certCount={certificates.length}
              />
            )}

            {tab === "certificates" && (
              <CertificatesTab
                certificates={certificates}
                onOpenCert={setCertDetail}
                onAdd={() => setShowAddCert(true)}
              />
            )}

            {tab === "profile" && (
              <ProfileTab
                user={user}
                points={points}
                registeredCount={registeredIds.length}
                attendedCount={attendedIds.length}
                certificates={certificates}
                pointsLog={pointsLog}
                subTab={profileSubTab}
                setSubTab={setProfileSubTab}
                onOpenCert={setCertDetail}
                onOpenRewards={() => setShowRewards(true)}
                onSignOut={signOut}
              />
            )}
          </main>

          <BottomNav tab={tab} setTab={setTab} />
        </div>
      </div>

      {detailEvent && (
        <EventDetailOverlay
          ev={detailEvent}
          isRegistered={registeredIds.includes(detailEvent.id)}
          onClose={() => setDetailEvent(null)}
          onRegister={registerEvent}
        />
      )}

      {payFlow && (
        <PaymentOverlay ev={payFlow} onCancel={() => setPayFlow(null)} onPaid={() => completeRegistration(payFlow)} />
      )}

      {showRewards && (
        <RewardsOverlay
          leaderboard={leaderboard}
          myRank={myRank}
          points={points}
          badgeState={badgeState}
          onClose={() => setShowRewards(false)}
        />
      )}

      {showAddCert && (
        <AddCertOverlay onClose={() => setShowAddCert(false)} onSubmit={addExternalCertificate} />
      )}

      {certDetail && <CertDetailOverlay cert={certDetail} onClose={() => setCertDetail(null)} showToast={showToast} />}

      <Toast toast={toast} />
    </div>
  );
}
