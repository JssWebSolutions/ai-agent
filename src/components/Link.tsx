import { Link as RouterLink } from 'react-router-dom';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  to: string; // Add 'to' as a required prop
}

export const Link: React.FC<LinkProps> = ({ children, to, ...props }) => {
  return <RouterLink to={to} {...props}>{children}</RouterLink>;
};
