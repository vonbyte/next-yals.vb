import Head from "next/head";

import styles from "../styles/Home.module.css";
import { Layout, Typography, Alert, Button, Form, Input } from "antd";
import { useState } from "react";
import axios, { AxiosError } from "axios";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
type ShortenLinkResponse = {
  short_link: string;
}

type ShortLinkError = {
  error: string;
  error_description: string;
}

type FormValues = {
  link: string;
}

export default function Home () {

  const [status, setStatus] = useState<"initial" | "error" | "success">(
    "initial");
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();

  const onFinish = async ({link}: FormValues) => {
    try {
      const response = await axios.post<ShortenLinkResponse>(
        "/api/shorten_link", { link });
      setStatus("success");
      setMessage(response.data?.short_link);
    } catch (e){
      const error = e as AxiosError
      setStatus("error");
      setMessage(error.response?.data?.error_description || 'Something wen wrong')
    }
  }

  const onFinishFailed = () => {
    setStatus("error");
    const error = form.getFieldError("link").join(" ");
    setMessage(error);
  }
  return (
    <Layout>
      <Head>
        <title>Yet another Link Shortener</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header>
        <div className={styles.logo} />
      </Header>
      <Content className={styles.content}>
        <div className={styles.shortener}>
          <Title level={5}>Copy &amp; Paste your lenghty link</Title>
          <Form form={form}
                onFinish={onFinish}
                onFinishfailed={onFinishFailed}>
            <div className={styles.linkField}>
              <div className={styles.linkFieldInput}>
                <Form.Item name="link" noStyle rules={[{
                  required: true,
                  message: "Please paste a correct link!",
                  type: "url"
                }]}>
                  <Input placeholder="https://my-super-long-link.com/blah-blah-blah-blah-blah" size="large"/>
                </Form.Item>
              </div>
              <div className={styles.linkFieldButton}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{width: '100%'}} size="large">Shorten!</Button>
                </Form.Item>
              </div>
            </div>
          </Form>
          {['error','success'].includes(status) && (<Alert showIcon message={message} type={status as "error" | "success"}/>)}
        </div>
      </Content>
      <Footer className={styles.footer}>
        Yet another link shortener (YALS) &copy; 2022
      </Footer>
    </Layout>
  );
}
