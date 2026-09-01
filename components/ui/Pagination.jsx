import { Fragment, useEffect } from "react";

const Pagination = ({
  isLoading,
  isError,
  goToPage,
  data,
  page,
  totalPages,
}) => {
  // Automatically navigate to the last valid page if current page has no data
  useEffect(() => {
    if (!isLoading && !isError) {
      if (totalPages > 0 && page > totalPages) {
        goToPage(totalPages);
      } else if (totalPages > 0 && data?.length === 0 && page > 1) {
        goToPage(Math.max(1, page - 1));
      } else if (totalPages === 0 && page > 1) {
        goToPage(1);
      }
    }
  }, [page, totalPages, data?.length, isLoading, isError, goToPage]);
  return (
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : isError ? (
        <span>Error</span>
      ) : (
        data?.length > 0 &&
        totalPages > 1 && (
          <div className="join mt-5 flex-wrap">
            <button
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
              className="join-item btn"
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 2 && p <= page + 2),
              )
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                return (
                  <Fragment key={p}>
                    {prev && p - prev > 1 && (
                      <button className="join-item btn btn-disabled" disabled>
                        ...
                      </button>
                    )}
                    <button
                      className={`join-item btn ${Number(page) === p ? "btn-nexoro-primary" : ""}`}
                      disabled={Number(page) === p}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </button>
                  </Fragment>
                );
              })}
            <button
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
              className="join-item btn"
            >
              »
            </button>
          </div>
        )
      )}
    </>
  );
};

export default Pagination;
