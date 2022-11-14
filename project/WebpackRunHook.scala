import sbt._
import play.sbt.PlayRunHook
import scala.sys.process.Process

object WebpackRunHook {
  def apply(base: File): PlayRunHook = {

    object WebpackProcess extends PlayRunHook {
      val npmRunStartCommand =  "npm run start"
      var process: Option[Process] = None

      override def beforeStarted(): Unit = {
        process = Some(Process(npmRunStartCommand, base).run)
      }

      override def afterStarted(): Unit =  {
        process collect {
          case process if process.exitValue() != 0 =>
            process.destroy()
            throw new Exception(s"Error executing command: $npmRunStartCommand")
        }
      }

      override def afterStopped(): Unit = {
        process.foreach(p => p.destroy())
        process = None
      }
    }

    WebpackProcess
  }
}
