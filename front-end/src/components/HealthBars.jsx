import ProgressBar from 'react-bootstrap/ProgressBar';

export default function HealthBars ({ players }) {
  return (
    <div>
      {players.map((item, index) => (
        <div style={{
          padding: "1px",
        }}>
          <ProgressBar key={index} variant={"success"} now={(item.health/item.max_health)*100} label={item.name} />
        </div>
      ))}
    </div>
  );
}
