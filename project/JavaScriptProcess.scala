import sbt.File

import scala.sys.process._

object JavaScriptProcess {
  def processBuilder(base: File, args: String*): ProcessBuilder = {
    if (sys.props("os.name").toLowerCase contains "windows") {
      Process("cmd" :: "/c" :: args.toList, base)
    } else {
      Process(args.toList, base)
    }
  }

  def webpackProcess(base: File, args: String*): ProcessBuilder = {
    if (sys.props("os.name").toLowerCase contains "windows") {
      Process("cmd" :: "/c" :: "node_modules\\.bin\\webpack.cmd" :: args.toList, base)
    }
    else {
      Process("node" :: "node_modules/.bin/webpack" :: args.toList, base)
    }
  }

}
