import { Card } from '@/components/ui-elements/card/Card';
import { AddTodoForm } from '../addTodoForm/AddTodoForm';

interface TodoSectionProps {}

export const TodoSection = ({}: TodoSectionProps) => {
  return (
    <>
      <Card variant="outlined" subHeader="TODO" attr={['margin-vertical', 'padding']}>
        <AddTodoForm />
      </Card>
    </>
  );
};
