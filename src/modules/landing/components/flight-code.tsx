export function FlightCode() {
  return (
    <span className="nf-board" aria-label="404" role="img">
      {["4", "0", "4"].map((digit, position) => (
        <span key={position} aria-hidden="true">{digit}</span>
      ))}
    </span>
  );
}
