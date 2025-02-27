import { useEffect, useState } from "react";
// firebase library
import {
  setDoc,
  doc,
  deleteDoc,
  getDocs,
  Timestamp,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
// local db config
import { db } from "../../services/firebase";

import {
  Typography,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Link,
} from "@mui/material";

import Loading from "../../components/Loading.jsx";
import AdminLayout from "../../components/layouts/AdminLayout";
import AutoCopyButton from "../../components/AutoCopyButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Head from "next/head";

export default function ManageKeys() {
  const [keys, setKeys] = useState([]);
  const [codes, setCodes] = useState([]);
  const [requestedName, setRequestedName] = useState("");

  // TODO:
  // add drop down list for type of access to be provisioned (admin, resident, etc) (maybe functions can be used for day pass)
  // check database to make sure use exists before giving them access

  async function deleteKey(key) {
    // get document from database which matches key
    await deleteDoc(doc(db, "globalKeys", key.id));
  }

  useEffect(() => {
    async function getKeys() {
      const q = query(collection(db, "globalKeys"));
      onSnapshot(q, (querySnapshot) => {
        const keysArray = [];
        querySnapshot.forEach((doc) => {
          keysArray.push({ ...doc.data(), id: doc.id });
        });
        setKeys(keysArray);
      });
    }
    async function getCodes() {
      const codes = await getDocs(collection(db, "loginCodes"));
      codes.forEach((doc) => {
        setCodes((prev) => [...prev, doc.data()]);
      });
    }
    getKeys();
    getCodes();
  }, []);

  async function giveUserAccess() {
    const alreadyExists = keys.find((doc) => doc.name === requestedName);
    const urlSafe = requestedName
      // remove all non-alphanumeric values except for spaces
      .replace(/[^a-zA-Z0-9- ]/g, "")
      // replace spaces with dashes
      .replace(/\s+/g, "-")
      // set to lowercase
      .toLowerCase();

    if (!alreadyExists) {
      setRequestedName("");
      await setDoc(doc(db, "globalKeys", urlSafe), {
        name: requestedName,
        urlSafe,
        weekdays: codes,
        created: Timestamp.now(),
      });
    } else {
      alert(
        `Sorry, we couldn't add this user.\n${
          alreadyExistsAsAuthorized ? "User is already authorized." : ""
        }${
          !existsInGlobalUsers
            ? "This user has not yet registered themselves."
            : ""
        }`
      );
    }
  }

  const listItems = keys.map((doc) => {
    const constructedURL = `https://moho-access.vercel.app/key?value=${doc.urlSafe}`;
    return (
      <ListItem divider key={doc.id}>
        <ListItemText primary={doc.name} secondary={doc.urlSafe} />
        <IconButton onClick={() => deleteKey(doc)}>
          <DeleteOutlineIcon />
        </IconButton>

        <AutoCopyButton copyItem={constructedURL} />
      </ListItem>
    );
  });

  return (
    <>
      <Head>
        <title>Gérer les Clés</title>
      </Head>
      <Loading loaded={listItems.length > 0} />
      {listItems.length > 0 && (
        <AdminLayout>
          <Typography variant="h2">Les Clés Globales</Typography>
          <Typography variant="subtitle1">
            Les mots clés énumérés ci-dessous sont actifs, et toute personne qui
            les connaît peut accéder à Moho . Sous chaque nom se trouve la
            version clé unique de la nom soumis. Ces mots-clés peuvent être
            recherchés à partir{" "}
            <Link target="_blank" href="/key">
              du portail public des clés
            </Link>
            .
          </Typography>
          <List>{listItems}</List>
          <Grid component="form">
            <TextField
              fullWidth
              label="Enter the name for a key"
              value={requestedName}
              onChange={(e) => setRequestedName(e.target.value)}
            />
            <Button onClick={giveUserAccess} variant="contained">
              Ajouter un Clé
            </Button>
          </Grid>
        </AdminLayout>
      )}
    </>
  );
}
