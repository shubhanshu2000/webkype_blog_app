import { Link } from "react-router";

const Navbar = () => {
  return (
    <>
      <div className="flex justify-between items-center px-6 py-4 border border-b-2">
        <Link to={"/home"}>
          <h1 className="text-2xl font-bold">Blogs</h1>
        </Link>
        <div>
          <Link className="mr-4" to={"/create-blog"}>
            Create Blog
          </Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
