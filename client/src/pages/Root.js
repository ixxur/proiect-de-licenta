import { Outlet, useNavigation } from "react-router-dom";


const RootLayout = () => {
  const navigation = useNavigation();

  return (
    <>
      <main>
      {  navigation.state === 'loading' && <p>Loading...</p>}
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;