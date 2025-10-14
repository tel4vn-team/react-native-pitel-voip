module.exports = {
  dependency: {
    platforms: {
      android: {
        sourceDir: './android',
        packageImportPath: 'import com.reactnativepitelvoip.PitelVoipPackage;',
      },
      ios: {
        // iOS không cần native module này
        project: null,
      },
    },
  },
};
