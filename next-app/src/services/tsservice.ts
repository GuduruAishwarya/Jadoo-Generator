"use client";

export function checkTypescript(code: string) {
  const ts = window["ts"] as any;
  const compilerOptions = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
  };
  const fileName = "temp.ts"; // any
  const sourceFile = ts.createSourceFile(
    fileName,
    code,
    // ScriptTarget.ES5,
    compilerOptions.target,
    true
  );
  const program = ts.createProgram({
    rootNames: [fileName],
    options: compilerOptions as any,
    // mocked host values to skip file handle
    host: {
      getSourceFile: (_fn: any) => (_fn == fileName ? sourceFile : undefined),
      getSourceFiles: () =>
        [
          {
            fileName: fileName,
          },
        ] as any,
      getCurrentDirectory: () => "/",
      getDefaultLibFileName: () => ts.getDefaultLibFileName(compilerOptions),
      useCaseSensitiveFileNames: () => true,
      //   getCurrentDirectory: ()=>[],
      writeFile: () => {},
      readFile: () => {
        return code;
      },
      getCanonicalFileName: (fn: any) => fn,
    },
  });

  const errors = ts
    .getPreEmitDiagnostics(program)
    .filter((d: any) => d.file)
    .map((d: any) => {
        const position = ts.getLineAndCharacterOfPosition(d.file, d.start)
        position.line++;
        position.character++;
    return {
      message: d.messageText,
      position: position,
    }});
  return {
    types: program.getSourceFiles().map((f: any)=> [...f.locals.keys()]).flat(),
    errors
  };
}
