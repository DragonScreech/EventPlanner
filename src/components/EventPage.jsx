import React, { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { arrayUnion, collection, doc, getDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { AuthContext } from '../context/AuthContext';
import '../css/EventPage.scss'

const EventPage = () => {
  const [event, setEvent] = useState(null);
  const [eventResponses, setEventResponses] = useState([])
  const [responses, setResponses] = useState({})
  const [allFields, setAllFields] = useState([])
  const [adminFields, setAdminFields] = useState([])
  const [responseSent, setResponseSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const location = useLocation()// Assuming you're using React Router;
  const queryParams = new URLSearchParams(location.search)
  const adminId = queryParams.get('adminId')
  const eventName = queryParams.get('eventName')

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, adminId, eventName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEvent(docSnap.data());
        const initialResponses = {}
        docSnap.data().fields.forEach(field => {
          initialResponses[field] = ''
        });
        setResponses(initialResponses)
        setAllFields([...docSnap.data().fields, ...docSnap.data().adminFields])
        setAdminFields(docSnap.data().adminFields)
        setEventResponses(docSnap.data().responses || [])
      } else {
        console.log('We could not find this event. It may have been deleted or you may have the wrong url')
      }
    };

    fetchEvent();
  }, [eventName, adminId]);

  const handleInputChange = (fieldName) => (e) => {
    setResponses(prev => ({ ...prev, [fieldName]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)

    const responseName = responses['name']
    let responseToUpdate = null

    eventResponses.forEach((existingResponses, index) => {
      if (existingResponses.name === responseName) {
        responseToUpdate = index
      }
    })

    const docRef = doc(db, adminId, eventName);
    const eventDoc = await getDoc(docRef);

    if (eventDoc.exists()) {
      if(responseToUpdate !== null) {
        const updatedResponses = eventDoc.data().responses
        updatedResponses[responseToUpdate] = responses
        await updateDoc(docRef, { responses: updatedResponses })
      }
      else {
        await updateDoc(docRef, {
          responses: arrayUnion(responses)
        })
      }
      setResponseSent(true)
    } else {
      console.log('We could not find this event. It may have been deleted or you may have the wrong url')
    }
    
    
    setLoading(false)
  }

  if (!event) return <div>Loading...</div>;

  const isAdmin = currentUser && currentUser.uid === adminId;


  return (
    <div className='eventContainer'>
      <div className='event-page'>
        <h1>RSVP for {event.name}!</h1>
        <form onSubmit={handleSubmit}>
          {allFields.map(field => (
            <div key={field}>
              <label>{field}</label>
              <input
                type='text'
                value={responses[field]}
                onChange={handleInputChange(field)}
              />
            </div>
          ))}
          <Link to={'/signin'}>Want to switch accounts?</Link>
          {loading ? 'Loading...' : ''}
          {responseSent ? 'Your response has been sent!' : ''}
          <button type='submit'>Submit RSVP</button>
        </form>
        <h2>Event Responses</h2>
        <ResponsesTable responses={eventResponses} showAdminFields={isAdmin} fields={allFields} adminFields={adminFields}></ResponsesTable>
      </div>
    </div>

  );
}

export default EventPage;

const ResponsesTable = ({ responses, showAdminFields, fields, adminFields }) => {
  return (
    <table>
      <thead>
        <tr>
          {fields.map((field, index) => {
            if (showAdminFields || !adminFields.includes(field)) {
              return <th key={index}>{field}</th>
            }
          })}
        </tr>
      </thead>
      <tbody>
        {responses.map((response, index) => (
          <tr key={index}>
            {fields.map((field, fieldIndex) => {
              if (showAdminFields || !adminFields.includes(field)) {
                return <td key={fieldIndex}>{response[field]}</td>
              }
              return null;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
