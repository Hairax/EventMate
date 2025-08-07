import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import brevo from '@getbrevo/brevo'

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

if (process.env.FIRESTORE_EMULATOR_HOST) {
  db.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
}

const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_APIKEY || '');


const smtpEmail = new brevo.SendSmtpEmail();

async function sendEmail(
    email: string
){
    smtpEmail.subject = "Invitación a Evento";
    smtpEmail.to = [{
        email: email
    }]
    smtpEmail.htmlContent = `<strong>Te han invitado a un evento. <a href="https://tusitio.com/register">Regístrate aquí</a></strong>`;
    smtpEmail.textContent = `Te han invitado a un evento. Regístrate para participar: https://tusitio.com/register`;
    smtpEmail.sender = {
        name: "EventMate",
        email: "rodrigo.test.qa3@gmail.com"
    };

    await apiInstance.sendTransacEmail(smtpEmail);
}

// Tipos explícitos del payload que esperamos
interface InviteData {
  eventId: string;
  email: string;
}

// Cloud Function callable usando Firebase Functions v2
export const inviteToEvent = onCall(
  async (request) => {
    // Validación de auth
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "No autorizado.");
    }

    const { eventId, email } = request.data as InviteData;

    if (!eventId || !email) {
      throw new HttpsError("invalid-argument", "Faltan datos.");
    }

    try {
      // Buscar si ya existe ese email como user
      let invitedUser;
      try {
        invitedUser = await auth.getUserByEmail(email);
      } catch {
        invitedUser = null;
      }

      const eventRef = db.collection("events").doc(eventId);
      const eventSnap = await eventRef.get();

      if (!eventSnap.exists) {
        throw new HttpsError("not-found", "Evento no encontrado.");
      }

      const eventData = eventSnap.data();
      const currentGuests: string[] = eventData?.guests || [];

      if (invitedUser) {
        const invitedUid = invitedUser.uid;

        if (currentGuests.includes(invitedUid)) {
          return { message: "Ya está invitado." };
        }

        await eventRef.update({
          guests: [...currentGuests, invitedUid],
        });

        return { message: "Usuario agregado como invitado." };
      } else if (!invitedUser) {
        // Usuario no registrado, enviar invitación por correo
        await sendEmail(email);
        
        // Aquí podrías agregar lógica para registrar al usuario si es necesario
        // o simplemente enviar el email de invitación
  return { message: "Usuario no registrado. Se envió un email de invitación." };
    }
  } catch (error: any) {
    console.error("Error en inviteToEvent:", error);
    throw new HttpsError("unknown", error.message || "Error desconocido");
  }
  }
);
