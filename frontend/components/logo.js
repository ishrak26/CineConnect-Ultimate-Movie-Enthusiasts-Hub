export default function Logo({ ...props }) {
  return (
    <img
      src="/LogoW.png" // Path to your logo in the public folder
      width="170" // Set width as desired
      height="150" // Set height as desired
      alt="CineConnect" // Alt text for the logo
      {...props}
    />
  );
}

