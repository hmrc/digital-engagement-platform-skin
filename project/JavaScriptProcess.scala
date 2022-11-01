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

  def nodeProcess(base: File, module: String, args: String*): ProcessBuilder = {
    if (sys.props("os.name").toLowerCase contains "windows") {
      Process("cmd" :: "/c" :: s"node_modules\\.bin\\$module.cmd" :: args.toList, base)
    }
    else {
      Process("node" :: s"node_modules/.bin/$module" :: args.toList, base)
    }
  }

}
