import Head from "next/head";

interface ISeo {
  title: string;
  description?: string;
  image?: string;
  article?: boolean;
}

const Seo = ({ title, description, image, article }: ISeo) => {
  return (
    <Head>
      <link rel="shortcut icon" href="/favicon.webp" />
      <title>{`${title} | Bác sĩ nhà quê`}</title>

      <meta property="og:locale" content="vi_VN" />
      <meta property="og:site_name" content="Bác sĩ nhà quê" />

      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />

      <meta name="description" content={description} />
      <meta property="og:description" content={description} />

      <meta name="twitter:description" content={description} />

      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image" content={image} />
      <meta name="twitter:image" content={image} />
      <meta name="image" content={image} />

      {article ? (
        <meta property="og:type" content="article" />
      ) : (
        <meta property="og:type" content="website" />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@InitHTML" />
    </Head>
  );
};

export default Seo;
