import crypto from "crypto";

// Pobieranie hasła z pliku .env
const password = process.env.ENCRYPTION_PASSWORD!;

// Tworzenie 32-bajtowego klucza szyfrowania z hasła
const key = crypto.createHash("sha256").update(password).digest();

// Funkcja do szyfrowania danych
export function encrypt(value: string | number): string | number {
  const text = typeof value === "number" ? value.toString() : value;

  const iv = crypto.randomBytes(16); // Losowy wektor inicjalizujący (IV)
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

// Funkcja do odszyfrowania danych
export function decrypt(text: string): string {
  const [iv, encryptedText] = text.split(":");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}
