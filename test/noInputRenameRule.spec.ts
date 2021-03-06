import { getFailureMessage, Rule } from '../src/noInputRenameRule';
import { assertAnnotated, assertSuccess } from './testHelper';

const {
  metadata: { ruleName }
} = Rule;

describe(ruleName, () => {
  describe('failure', () => {
    describe('Component', () => {
      it('should fail when an input property is renamed', () => {
        const source = `
          @Component({
            selector: 'foo'
          })
          class TestComponent {
            @Input('bar') label: string;
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          }
        `;
        assertAnnotated({
          message: getFailureMessage('TestComponent', 'label'),
          ruleName,
          source
        });
      });

      it('should fail when an input property is fake renamed', () => {
        const source = `
          @Component({
            selector: 'foo'
          })
          class TestComponent {
            @Input('foo') label: string;
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          }
        `;
        assertAnnotated({
          message: getFailureMessage('TestComponent', 'label'),
          ruleName,
          source
        });
      });
    });

    describe('Directive', () => {
      it('should fail when an input property is renamed', () => {
        const source = `
          @Directive({
            selector: '[foo]'
          })
          class TestDirective {
            @Input('labelText') label: string;
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          }
        `;
        assertAnnotated({
          message: getFailureMessage('TestDirective', 'label'),
          ruleName,
          source
        });
      });

      it('should fail when an input property is renamed and its name is strictly equal to the property', () => {
        const source = `
          @Directive({
            selector: '[label]'
          })
          class TestDirective {
            @Input('label') label: string;
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          }
        `;
        assertAnnotated({
          message: getFailureMessage('TestDirective', 'label'),
          ruleName,
          source
        });
      });

      it('should fail when an input property has the same name that the alias', () => {
        const source = `
          @Directive({
            selector: '[foo]'
          })
          class TestDirective {
            @Input('label') label: string;
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          }
        `;
        assertAnnotated({
          message: getFailureMessage('TestDirective', 'label'),
          ruleName,
          source
        });
      });
    });
  });

  describe('success', () => {
    describe('Component', () => {
      it('should succeed when an input property is not renamed', () => {
        const source = `
          @Component
          class TestComponent {
            @Input() label: string;
          }
        `;
        assertSuccess(ruleName, source);
      });
    });

    describe('Directive', () => {
      it('should succeed when the first directive selector is strictly equal to the alias', () => {
        const source = `
          @Directive({
            selector: '[foo], label2'
          })
          class TestDirective {
            @Input('foo') bar: string;
          }
        `;
        assertSuccess(ruleName, source);
      });

      it('should succeed when the second directive selector is strictly equal to the alias', () => {
        const source = `
          @Directive({
            selector: '[foo], myselector'
          })
          class TestDirective {
            @Input('myselector') bar: string;
          }
        `;
        assertSuccess(ruleName, source);
      });

      it('should succeed when a directive selector is also an input property', () => {
        const source = `
          @Directive({
            selector: '[foo], label2'
          })
          class TestDirective {
            @Input() foo: string;
          }
        `;
        assertSuccess(ruleName, source);
      });
    });
  });
});
