import { Card } from '@/components/ui-elements/card/Card';

interface TodoSectionProps {}

export const TodoSection = ({}: TodoSectionProps) => {
  return (
    <>
      <Card variant="outlined" subHeader="TODO" attr={['margin-vertical', 'padding']}></Card>
    </>
  );
};
