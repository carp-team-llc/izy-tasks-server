import multer from "multer";
import { Client } from "@microsoft/microsoft-graph-client";
import fetch from "isomorphic-fetch";
import dotenv from "dotenv";

const UploadFileToCloud = async () => {
  const upload = multer({ dest: "uploads/" });
  const getAuthenticatedClient = async () => {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const tenantId = process.env.TENANT_ID;
    const scope = "https://graph.microsoft.com/.default";

    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope: scope,
        }),
      }
    );
    const tokenJson = await tokenResponse.json();
    const accessToken = tokenJson.access_token;

    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });    
  };

  const client = getAuthenticatedClient();

};
