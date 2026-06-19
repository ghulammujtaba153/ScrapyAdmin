import { Flex, Typography, Space } from 'antd';

const { Title, Text } = Typography;

const AdminPageHeader = ({ title, subtitle, extra, children }) => (
    <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16} style={{ marginBottom: 24 }}>
        <div>
            <Title level={3} style={{ margin: 0 }}>
                {title}
            </Title>
            {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>
        {(extra || children) && <Space wrap>{extra || children}</Space>}
    </Flex>
);

export default AdminPageHeader;
