const AccountInfo = () => {
  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-300">
      <table className="table">
        <tbody>
          <tr>
            <td className="p-5">Name</td>
            <td className="p-5">User</td>
          </tr>
          {/* row 2 */}
          <tr>
            <td className="p-5">Address</td>
            <td className="p-5">BD</td>
          </tr>
          {/* row 3 */}
          <tr>
            <td className="p-5">Phone</td>
            <td className="p-5">+880</td>
          </tr>
          <tr>
            <td className="p-5">Company</td>
            <td className="p-5">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AccountInfo;
