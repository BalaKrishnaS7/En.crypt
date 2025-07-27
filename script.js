document.addEventListener("DOMContentLoaded", () => {
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");

  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const tab = link.dataset.tab;

      tabLinks.forEach((link) => link.classList.remove("active"));
      link.classList.add("active");

      tabContents.forEach((content) => {
        if (content.id === tab) {
          content.classList.add("active");
        } else {
          content.classList.remove("active");
        }
      });
    });
  });

  togglePasswordButtons.forEach(button => {
    button.addEventListener("click", () => {
        const passwordInput = button.previousElementSibling;
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            button.textContent = "🙈";
        } else {
            passwordInput.type = "password";
            button.textContent = "👁️";
        }
    });
  });
});
