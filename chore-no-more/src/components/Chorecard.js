const Chorecard = ({ chore }) => {
    return (
      <div className="chore-card">
        <h3>{chore.Chore}</h3>
        <p>{chore.Created}</p>
      </div>
    )
  }
  
  export default Chorecard