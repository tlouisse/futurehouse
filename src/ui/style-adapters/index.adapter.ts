export default {
  entries: [
    {
      name: 'formControlStyles',
      files: [
        './material-web/build/mdc.form-field.css',
        './material-web/build/mdc.floating-label.css',
      ],
      host: '.mdc-text-field',
      states: {
        '[shows-feedback-for~="error"]': '.mdc-text-field--invalid',
        '[filled]': '.mdc-text-field--filled',
      },
      slots: {
        label: '.mdc-floating-label',
        prefix: '.mdc-text-field__affix.mdc-text-field__affix--prefix',
        suffix: '.mdc-text-field__affix.mdc-text-field__affix--prefix',
        input: '.mdc-text-field__input',
        // before:
        // after:
      },
    },
  ],
};
