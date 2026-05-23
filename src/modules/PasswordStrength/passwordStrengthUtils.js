const STRENGTH_LEVELS = {
  0: { label: "", color: "#d4d4d8", bars: 0 },
  1: { label: "낮음", color: "#c94a4a", bars: 1 },
  2: { label: "보통", color: "#ffb23e", bars: 2 },
  3: { label: "높음", color: "#00c015", bars: 3 },
};

export function getPasswordStrength(password) {
  if (!password || password.length === 0) {
    return STRENGTH_LEVELS[0];
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  const variety = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  if (variety >= 2) score += 1;
  if (variety >= 3) score += 1;

  if (password.length < 8 || variety < 2) {
    return STRENGTH_LEVELS[1];
  }

  if (score <= 2) {
    return STRENGTH_LEVELS[2];
  }

  return STRENGTH_LEVELS[3];
}
