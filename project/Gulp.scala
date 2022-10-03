import sbt.File

import scala.sys.process._

object Gulp {
  def gulpProcess(base: File, args: String*): ProcessBuilder = {
    if (sys.props("os.name").toLowerCase contains "windows") {
      Process("cmd" :: "/c" :: "node_modules\\.bin\\webpack.cmd" :: args.toList, base)
    }
    else {
      Process("node" :: "node_modules/.bin/webpack" :: args.toList, base)
    }
  }

  def npmProcess(base: File, args: String*): ProcessBuilder = {
    if (sys.props("os.name").toLowerCase contains "windows") {
      Process("cmd" :: "/c" :: "npm" :: args.toList, base)
    }
    else {
      Process("npm" :: args.toList, base)
    }
  }
}
