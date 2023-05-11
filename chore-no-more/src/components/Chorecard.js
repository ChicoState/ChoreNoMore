import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import cards from '../index.css';
import { useSession} from '@supabase/auth-helpers-react';



const Chorecard = ({ chore, onDelete, onClaim, name}) => {

  const session = useSession();

  const handleDelete = async () => {
    const {data, error} = await supabase
    .from('Chores')
    .delete()
    .eq('id', chore.id)
    if (error) {
      console.log(error)
    }
    if (data) {
      console.log(data)
    }
    onDelete(chore.id);
  }

  const claimChore = async () => {
    console.log(session);
    const{error, data} = await supabase
    .from('Chores')
    .update({Assignee : name})
    .eq('id', chore.id)
    if(error){
      console.log(error)
    }
    if(data){
      console.log(data)
    }
    onClaim(chore.id);
  }

  return (
    <div className="chore-card">
      <h3>{chore.Chore}</h3>
     <div> <div>User: {chore.Assignee}</div> </div><br />
      <div className="buttons">
        <i className="material-icons" onClick={claimChore}>Claim</i>
        <i className="material-icons" onClick={handleDelete}>Complete</i>
      </div>
      </div>
  )
}
  
  export default Chorecard
