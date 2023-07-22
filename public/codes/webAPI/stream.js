(async function () {
  async function* ints() {
    for (let i = 0; i < 5; i++) {
      yield await new Promise((resolve) => {
        setTimeout(resolve, 1000, i);
      });
    }
  }

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (let chunk of ints()) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  const [readerStream1, readerStream2] = readableStream.tee();

  const writableStream = new WritableStream({
    write(chunk) {
      console.log(chunk);
    },
  });
  readerStream1.pipeTo(writableStream);

  const writableStreamOther = new WritableStream({
    write(chunk) {
      console.log(chunk);
    },
  });
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk * 2);
    },
  });

  //pipedStream是二者合体得到的流,reader流的reader口接到了transform的writer口
  //所以pipedStream是个可读流
  const pipedStream = readerStream2.pipeThrough(transformStream);
  const reader = pipedStream.getReader();
  const writer = writableStreamOther.getWriter();
  (async function () {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      } else {
        writer.write(value);
      }
    }
  })();
})();
