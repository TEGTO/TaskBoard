
import { StringFormaterService } from './string-format.service';

describe('StringFormatService', () => {
  it('should return the format string if no placeholders are provided', () => {
    const format = 'Hello, world!';
    const result = StringFormaterService.format(format);
    expect(result).toEqual(format);
  });
  it('should substitute placeholders with provided arguments', () => {
    const format = 'Hello, {0}! Welcome to {1}.';
    const result = StringFormaterService.format(format, 'Alice', 'Wonderland');
    expect(result).toEqual('Hello, Alice! Welcome to Wonderland.');
  });
  it('should leave placeholders if undefined arguments', () => {
    const format = 'Hello, {0}!';
    const result = StringFormaterService.format(format, undefined);
    expect(result).toEqual('Hello, {0}!');
  });
  it('should handle extra arguments', () => {
    const format = 'Hello, {0}!';
    const result = StringFormaterService.format(format, 'Alice', 'Extra');
    expect(result).toEqual('Hello, Alice!');
  });
  it('should handle multiple placeholders with the same index', () => {
    const format = 'Hello, {0}! Welcome to {0}.';
    const result = StringFormaterService.format(format, 'Alice');
    expect(result).toEqual('Hello, Alice! Welcome to Alice.');
  });
  it('should handle no placeholders', () => {
    const format = 'Hello, world!';
    const result = StringFormaterService.format(format, 'Extra');
    expect(result).toEqual('Hello, world!');
  });
  it('should handle empty format string', () => {
    const format = '';
    const result = StringFormaterService.format(format);
    expect(result).toEqual('');
  });
  it('should handle format string with only placeholders', () => {
    const format = '{0} {1} {2}';
    const result = StringFormaterService.format(format, 'A', 'B', 'C');
    expect(result).toEqual('A B C');
  });
});
