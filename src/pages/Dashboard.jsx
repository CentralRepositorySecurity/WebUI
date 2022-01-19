import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Dashboard.less';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { processStatistic, getTodayRecord } from '@/services/ant-design-pro/api';

const { Statistic, Divider } = StatisticCard;

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Dashboard = () => {
  const intl = useIntl();
  const [responsive, setResponsive] = useState(false);
  const [processValue, setProcessValue] = useState({ title: '任务总量', value: 0 });
  useEffect(async () => {
    const obj = await processStatistic();
    setProcessValue(obj.data);
  }, []);

  const [riskSummary, setRiskSummary] = useState({
    title: '风险总量',
    value: 0,
    description: <Statistic title="占比" value="61.5%" />,
  });
  useEffect(async () => {
    const obj = await getTodayRecord();
    setRiskSummary({
      title: obj.data.title,
      value: obj.data.today,
      description: <Statistic title="占比" value={obj.data.rate + '%'} />,
    });
  }, []);

  return (
    <PageContainer>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
          <StatisticCard statistic={processValue} />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={riskSummary}
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/ShNDpDTik/huan.svg"
                alt="百分比"
                width="100%"
              />
            }
            chartPlacement="left"
          />
          <StatisticCard
            statistic={{
              title: '漏洞占比',
              value: 1806062,
              description: <Statistic title="占比" value="38.5%" />,
            }}
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/6YR18tCxJ/huanlv.svg"
                alt="百分比"
                width="100%"
              />
            }
            chartPlacement="left"
          />
        </StatisticCard.Group>
      </RcResizeObserver>
      <Card></Card>
    </PageContainer>
  );
};

export default Dashboard;
