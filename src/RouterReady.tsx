import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export interface RouterReadyProps {
  /**
   * You can wrap a node.
   */
  children?: React.ReactNode;
  /**
   * The fallback content to display.
   * @default null
   */
  fallback?: React.ReactNode;
}

function RouterReady(props: RouterReadyProps): JSX.Element {
  const { children, fallback = null } = props;
  const [isRouterReady, setIsRouterReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsRouterReady(router.isReady);
  }, [router.isReady]);

  return <>{isRouterReady ? children : fallback}</>;
}

export default RouterReady;
