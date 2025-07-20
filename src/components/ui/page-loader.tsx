import { Loader } from './Loader';

export function PageLoader({ className }: { className?: string }) {
  return <Loader variant="fullscreen" text="Loading application..." className={className} />;
}
