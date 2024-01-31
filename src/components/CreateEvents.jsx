import React, { useContext, useState } from "react";
import "../css/CreateEvents.scss";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const MyEvents = () => {
  const [fieldsText, setFieldsText] = useState("");
  const [confidentialFieldsText, setConfidentialFieldsText] = useState("");
  const [eventCreated, setEventCreated] = useState(false);
  const [fields, setFields] = useState([]);
  const [conFields, setConFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventName, setEventName] = useState("");
  const [nameDup, setNameDup] = useState(false);
  const [createdEventName, setCreatedEventName] = useState("");
  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newFields = fieldsText ? fieldsText.split(",") : [];
    const newConFields = confidentialFieldsText ? confidentialFieldsText.split(",") : [];

    const events = collection(db, currentUser.uid);
    const q = query(events, where("name", "==", eventName));
    const qShot = await getDocs(q);

    if (qShot.empty) {
      await setDoc(doc(db, currentUser.uid, eventName), {
        name: eventName,
        fields: ["Name", 'Total # of people(including you)', ...newFields], // Use the new values directly
        adminFields: newConFields,
      });
      setEventCreated(true);
      setNameDup(false);
      setCreatedEventName(eventName);
      setEventName("");
      setFieldsText("");
      setConfidentialFieldsText("");
    } else {
      console.log("You cannot create an event with a duplicate name");
      setEventCreated(false);
      setNameDup(true);
    }

    setLoading(false);
  };


  return (
    <div className="createEvent">
      <form className="createEventForm" onSubmit={handleSubmit}>
        <h1>Create Event</h1>
        <label>Event Name</label>
        <input
          type="text"
          placeholder="Event Name"
          onChange={(e) => setEventName(e.target.value)}
          value={eventName}
        ></input>
        <label>
          Fields(Seperate with commas(Note: Do not add a name field because it
          will be added automatically to the event. The same apllies for the total people field))
        </label>
        <input
          type="text"
          placeholder="Ex. adults, children, allergies"
          onChange={(e) => setFieldsText(e.target.value)}
          value={fieldsText}
        ></input>
        <label>Confidential Fields(Only you can see these fields)</label>
        <input
          type="text"
          placeholder="Confidential Fields"
          onChange={(e) => setConfidentialFieldsText(e.target.value)}
          value={confidentialFieldsText}
        />
        <button type="submit">Create Event</button>
        <Link to={"/signin"}>Want to switch accounts?</Link>
        {eventCreated && (
          <div className="linkMessage">
            Make sure to save this link:<br></br>
            <a href={`/event?adminId=${currentUser.uid}&eventName=${createdEventName}`}>{`/event?adminId=${currentUser.uid}&eventName=${createdEventName}`}</a>
          </div>
        )}
        {nameDup ? "You cannot create an event with a duplicate name" : ""}
        {loading ? "Loading..." : ""}
      </form>
    </div>
  );
};

export default MyEvents;
