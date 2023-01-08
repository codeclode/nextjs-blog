export async function getStaticProps(context) {
  return {
    redirect: {
      destination: '/',
      permanent: true, // triggers 308
    },
  };
}
export default function Custom404() {
  return <Layout> <h1>ABOUT</h1></Layout>;
}