import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { Header } from "../Header";
import { PageLoading } from "./PageLoading";
import { getPageLoadingAssets } from "./pageLoadingAssets";

/**
 * 해당 페이지에 필요한 소스를 받은 뒤 children을 표시
 */
export const PageLoadingGate = ({ children, sources: sourcesOverride }) => {
  const location = useLocation();
  const sources = useMemo(() => {
    if (sourcesOverride?.length) {
      return sourcesOverride;
    }
    return getPageLoadingAssets(location.pathname);
  }, [location.pathname, sourcesOverride]);

  const sourcesKey = JSON.stringify(sources);
  const [ready, setReady] = useState(() => sources.length === 0);

  useEffect(() => {
    setReady(sources.length === 0);
  }, [sourcesKey, sources.length]);

  if (!ready) {
    return (
      <div className="page-loading-shell">
        <Header variant="light" />
        <PageLoading
          sources={sources}
          onComplete={() => setReady(true)}
          layout="below-header"
        />
      </div>
    );
  }

  return children;
};

PageLoadingGate.propTypes = {
  children: PropTypes.node.isRequired,
  sources: PropTypes.arrayOf(PropTypes.string),
};
