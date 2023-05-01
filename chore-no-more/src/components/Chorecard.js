import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';


const Chorecard = ({ chore }) => {

  return (
    <div className="smoothie-card">
      <h3>{chore.Chore}</h3>
      </div>
  )
}
  
  export default Chorecard