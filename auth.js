
(() => {
  "use strict";

  const client = window.displaceSupabase;

  // Entry screens
  const entryScreen = document.getElementById("entry-screen");
  const welcomeView = document.getElementById("welcome-view");
  const roleView = document.getElementById("role-view");
  const loginView = document.getElementById("login-view");
  const appShell = document.getElementById("app-shell");

  // Entry navigation
  const enterButton = document.getElementById("enter-btn");
  const roleCards = document.querySelectorAll("[data-role]");
  const backButtons = document.querySelectorAll("[data-entry-back]");

  // Authentication form
  const authForm = document.getElementById("entry-auth-form");
  const emailInput = document.getElementById("entry-email");
  const passwordInput = document.getElementById("entry-password");
  const submitButton = document.getElementById("entry-submit");
  const authMessage = document.getElementById("entry-auth-message");
  const authHeading = document.getElementById("auth-heading");
  const authDescription = document.getElementById("auth-description");
  const authRoleLabel = document.getElementById("auth-role-label");
  const modeButtons = document.querySelectorAll("[data-auth-mode]");
  const togglePassword = document.getElementById("toggle-password");

  let selectedRole = null;
  let authMode = "login";
  let authRequestInProgress = false;
  let sessionCheckInProgress = false;

  function showMessage(text, type = "info") {
    if (!authMessage) return;

    authMessage.textContent = text;
    authMessage.dataset.type = type;
  }

  function showView(view) {
    if (!entryScreen) return;

    welcomeView?.classList.toggle("hidden", view !== "welcome");
    roleView?.classList.toggle("hidden", view !== "role");
    loginView?.classList.toggle("hidden", view !== "login");
    entryScreen.classList.remove("hidden");

    if (appShell) appShell.classList.add("hidden");
  }

  
function showDashboard(role) {
  if (entryScreen) entryScreen.classList.add("hidden");
  if (appShell) appShell.classList.remove("hidden");

  document.body.dataset.userRole = role;

  // Show role-specific navigation links.
  document.querySelectorAll("[data-role-view]").forEach(element => {
    const allowedRoles = element.dataset.roleView.split(",");
    element.classList.toggle("hidden", !allowedRoles.includes(role));
  });

  const heading = document.getElementById("heading");
  const subheading = document.getElementById("subheading");

  if (role === "affected") {
    if (heading) heading.textContent = "Community Assistance";
    if (subheading) {
      subheading.textContent =
        "Request help and follow the progress of your relief requests.";
    }
  } else {
    if (heading) heading.textContent = "Relief Operations";
    if (subheading) {
      subheading.textContent =
        "Coordinate incidents, relief supplies, and response activities.";
    }
  }
}


  function setAuthMode(mode) {
    authMode = mode;

    modeButtons.forEach((button) => {
      const active = button.dataset.authMode === mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (authHeading) {
      authHeading.innerHTML =
        mode === "login"
          ? 'Welcome <span>back.</span>'
          : 'Create your <span>account.</span>';
    }

    if (authDescription) {
      authDescription.textContent =
        mode === "login"
          ? "Sign in to continue to DisplaceOS."
          : "Create an account using your email address.";
    }

    if (submitButton) {
      submitButton.innerHTML =
        mode === "login"
          ? 'Sign in <span>→</span>'
          : 'Create account <span>→</span>';
    }

    if (passwordInput) {
      passwordInput.autocomplete =
        mode === "login" ? "current-password" : "new-password";
    }

    showMessage("");
  }

  function chooseRole(role) {
    selectedRole = role;

    if (authRoleLabel) {
      authRoleLabel.textContent =
        role === "affected"
          ? "COMMUNITY ASSISTANCE"
          : "RELIEF AGENCY ACCESS";
    }

    if (role === "agency" && authDescription) {
      authDescription.textContent =
        "Sign in with an authorized agency account. New agency access requires verification.";
    }

    setAuthMode("login");
    showView("login");
  }

  async function checkSession() {
    if (!client || sessionCheckInProgress) return;

    sessionCheckInProgress = true;

    try {
      const { data, error } = await client.auth.getSession();

      if (error) throw error;

      if (data.session?.user) {
        // Agency accounts must have an authorized database profile.
        // Selecting the agency card does not grant privileges.
        const { data: profile, error: profileError } = await client
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .maybeSingle();

        if (profileError) {
          showView("login");
          showMessage(
            "Your session exists, but account permissions could not be verified. Please try again.",
            "error"
          );
          return;
        }

       
const role = profile?.role;

if (selectedRole === "agency") {
  if (!["agency", "admin", "responder"].includes(role)) {
    showView("login");
    showMessage(
      "Agency access is not authorized for this account.",
      "error"
    );
    return;
  }

  showDashboard(role);
  return;
}

if (selectedRole === "affected") {
  // Affected accounts must not enter agency accounts.
  if (["agency", "admin", "responder"].includes(role)) {
    showView("login");
    showMessage(
      "This account is registered for agency access. Select Helping Agency.",
      "error"
    );
    return;
  }

  showDashboard("affected");
  return;
}

// Session restoration after refresh: trust the stored profile role.
if (["agency", "admin", "responder"].includes(role)) {
  showDashboard(role);
} else {
  showDashboard("affected");
}


        // This opens the existing prototype dashboard for authenticated
        // affected-person accounts. It is not yet a private request portal.
        showDashboard();
      } else {
        showView("welcome");
      }
    } catch (error) {
      showView("welcome");
      showMessage(`Session check failed: ${error.message}`, "error");
    } finally {
      sessionCheckInProgress = false;
    }
  }

  if (
    !entryScreen ||
    !welcomeView ||
    !roleView ||
    !loginView ||
    !appShell ||
    !authForm ||
    !emailInput ||
    !passwordInput ||
    !submitButton ||
    !authMessage
  ) {
    console.error(
      "DisplaceOS entry screen elements are missing. Check index.html IDs."
    );
    return;
  }

  if (!client) {
    showView("welcome");
    showMessage(
      "Supabase is unavailable. Check supabase.js and your network connection.",
      "error"
    );
    console.error("DisplaceOS Supabase client is missing.");
    return;
  }

  // Prevent the dashboard from being shown before session validation.
  showView("welcome");

  enterButton?.addEventListener("click", () => {
    showView("role");
  });

  roleCards.forEach((card) => {
    card.addEventListener("click", () => {
      chooseRole(card.dataset.role);
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.entryBack;
      showView(target === "role" ? "role" : "welcome");
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setAuthMode(button.dataset.authMode);
    });
  });

  togglePassword?.addEventListener("click", () => {
    const reveal = passwordInput.type === "password";
    passwordInput.type = reveal ? "text" : "password";
    togglePassword.textContent = reveal ? "Hide" : "Show";
    togglePassword.setAttribute(
      "aria-label",
      reveal ? "Hide password" : "Show password"
    );
  });

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("DisplaceOS login form submitted");

    if (authRequestInProgress) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!selectedRole) {
      showMessage("Please select how you want to use DisplaceOS.", "error");
      showView("role");
      return;
    }

    if (!email || password.length < 8) {
      showMessage(
        "Enter a valid email and a password of at least 8 characters.",
        "error"
      );
      return;
    }

    authRequestInProgress = true;
    submitButton.disabled = true;
    showMessage(
      authMode === "login" ? "Signing in..." : "Creating your account..."
    );

    try {
      if (authMode === "signup") {
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });

        if (error) throw error;

        if (data.session) {
          showMessage(
            "Account created. Checking your account permissions..."
          );
          await checkSession();
        } else {
          showMessage(
            "Account created. Check your email to confirm your address, then return here and sign in.",
            "success"
          );
          setAuthMode("login");
        }
      } else {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (!data.session) {
          throw new Error("No session was returned. Please try again.");
        }

        showMessage("Signed in. Checking account permissions...");
        await checkSession();
      }
    } catch (error) {
      showMessage(
        `${authMode === "login" ? "Sign-in" : "Signup"} failed: ${error.message}`,
        "error"
      );
    } finally {
      authRequestInProgress = false;
      submitButton.disabled = false;
    }
  });

  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session) {
      selectedRole = null;
      showView("welcome");
      return;
    }

    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
      // Defer Supabase queries out of the auth-state callback.
      setTimeout(() => {
        checkSession();
      }, 0);
    }
  });

  const dashboardLogoutButton = document.getElementById(
  "dashboard-logout-btn"
);

dashboardLogoutButton?.addEventListener("click", async () => {
  dashboardLogoutButton.disabled = true;
  dashboardLogoutButton.textContent = "Signing out...";

  try {
    const { error } = await client.auth.signOut();

    if (error) throw error;

    selectedRole = null;
    showView("welcome");
    showMessage("You have signed out successfully.", "success");
  } catch (error) {
    showMessage(`Sign-out failed: ${error.message}`, "error");
  } finally {
    dashboardLogoutButton.disabled = false;
    dashboardLogoutButton.textContent = "Sign out";
  }
});

  checkSession();
})();

