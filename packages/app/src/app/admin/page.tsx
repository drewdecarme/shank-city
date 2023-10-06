"use client";

const Admin = () => {
  return (
    // const { message } = useMessage({
    //   url: `/api/messages/admin`,
    //   method: "GET",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // });
    <>
      <div className="content-layout">
        <h1 id="page-title" className="content__title">
          Admin Page
        </h1>
        <div className="content__body">
          <p id="page-description">
            <span>
              This page retrieves an <strong>admin message</strong>.
            </span>
            <span>
              <strong>
                Only authenticated users with the{" "}
                <code>read:admin-messages</code> permission should access this
                page.
              </strong>
            </span>
          </p>
          {/* <pre>{message}</pre> */}
        </div>
      </div>
    </>
  );
};

export default Admin;
