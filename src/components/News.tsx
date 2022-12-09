import moment from "moment";
import { Select, Typography, Row, Col, Avatar, Card } from "antd";
import { useGetCryptoNewsQuery } from "../services/cryptoNewsApi";
import { useState } from "react";
import { useGetCryptosQuery } from "../services/cryptoApi";

const { Title, Text } = Typography;
const { Option } = Select;

interface Props {
  simplified: boolean;
}

const demoImage =
  "https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News";

const News = ({ simplified }: Props) => {
  const [newsCategory, setNewsCategory] = useState("Cryptocurrency");

  const { data: cryptoNews } = useGetCryptoNewsQuery({
    newsCategory,
    count: simplified ? 6 : 12,
  });
  const { data } = useGetCryptosQuery(100);

  if (!cryptoNews?.value) return <p>Loading...</p>;

  return (
    <Row gutter={[24, 24]}>
      {!simplified && (
        <Col span={24}>
          <Select
            showSearch
            className="select-news"
            placeholder="Select a Crypto"
            optionFilterProp="children"
            onChange={(val) => setNewsCategory(val)}
            filterOption={(input, option) =>
              option?.children
                ?.toString()
                .toLowerCase()!
                .indexOf(input.toLowerCase())! >= 0
            }
          >
            <Option value="Cryptocurrency">Cryptocurrency</Option>
            {data?.data?.coins.map((coin: any) => (
              <Option value={coin.name}>{coin.name}</Option>
            ))}
          </Select>
        </Col>
      )}

      {cryptoNews.value.map((news: any, i: number) => (
        <Col xs={24} sm={12} lg={8} key={i}>
          <Card hoverable className="news-card">
            <a href={news.url} target="_blank" rel="noreferrer">
              <div className="news-image-container">
                <Title className="news-title" level={4}>
                  {news.name}
                </Title>

                <img
                  style={{ maxWidth: "200px", maxHeight: "100px" }}
                  src={news?.image?.thumbnail?.contentUrl || demoImage}
                  alt="news"
                />
              </div>
              <p>
                {news.description > 100
                  ? `${news.description.substring(0, 100)}...`
                  : news.description}
              </p>
              <div className="provider-container">
                <div>
                  <Avatar
                    src={
                      news.provider[0]?.image?.thumbnail?.contentUrl ||
                      demoImage
                    }
                    alt="news"
                  />
                  <Text className="provider-name">
                    {news.provider[0]?.name}
                  </Text>
                </div>
                <Text>{moment(news.datePublished).startOf("s").fromNow()}</Text>
              </div>
            </a>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default News;
