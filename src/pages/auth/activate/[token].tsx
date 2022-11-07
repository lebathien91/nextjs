import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import Layout from "@/layout/index";
import { postData } from "@/utils/fetchData";
import Seo from "@/components/Seo";

export default function ActivationEmail() {
  const router = useRouter();
  const activationToken = router.query.token;
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  useEffect(() => {
    postData(`auth/activate`, { activationToken }).then((res) => {
      if (res.error) {
        return setError(res.error);
      }

      return setSuccess(res.success);
    });
  }, [activationToken]);

  return (
    <div className="container mx-auto px-4 min-h-screen">
      <div className="py-10 text-2xl text-center">
        {error && <h1 className="my-2 text-red-600">{error}</h1>}
        {success && (
          <>
            <h1 className="my-2 text-red-600">
              Chúc mừng bạn tài khoản đã được kích hoạt.
            </h1>
            <span>
              Để tiếp tục sử dụng đầy đủ chức năng hãy{" "}
              <Link href="/login">
                <a className="text-sky-800 font-semibold">Đăng nhập</a>
              </Link>
            </span>
          </>
        )}
      </div>
    </div>
  );
}

ActivationEmail.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Seo title="Kích hoạt tài khoản" />
      {page}
    </Layout>
  );
};
