import { Priority } from '../../index';
import { PriorityConvertorService } from './priority-convertor.service';

describe('PriorityConvertorService', () => {
  it('should return all priority strings', () => {
    const expectedPriorities = ['Low', 'Medium', 'High'];
    const result = PriorityConvertorService.getAllPrioritiesString();
    expect(result).toEqual(expectedPriorities);
  });
  it('should return correct string for Low priority', () => {
    const priority = Priority.Low;
    const result = PriorityConvertorService.getPriorityString(priority);
    expect(result).toEqual('Low');
  });
  it('should return correct string for Medium priority', () => {
    const priority = Priority.Medium;
    const result = PriorityConvertorService.getPriorityString(priority);
    expect(result).toEqual('Medium');
  });
  it('should return correct string for High priority', () => {
    const priority = Priority.High;
    const result = PriorityConvertorService.getPriorityString(priority);
    expect(result).toEqual('High');
  });
  it('should return empty string for unknown priority', () => {
    const priority = 100;
    const result = PriorityConvertorService.getPriorityString(priority as Priority);
    expect(result).toEqual('');
  });
});
