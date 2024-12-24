import { Link as RouterLink } from 'react-router-dom';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  return <RouterLink {...props}>{children}</RouterLink>;
};
