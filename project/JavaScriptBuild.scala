import sbt.Keys._
import sbt._

object JavaScriptBuild {
  val configDirectory = SettingKey[File]("configDirectory")
  val runAllTests = TaskKey[Int]("runAllTests")
  val npmInstall = TaskKey[Int]("npm-install")

  private def runOperation(operation: String, result: Int): Int = {
    if (result != 0) {
      throw new Exception(s"$operation failed with result $result")
    }
    result
  }

  val javaScriptTestRunnerHook: Seq[sbt.Def.Setting[_]] = {
    Seq(
      configDirectory := {
        Compile / baseDirectory
      }.value,

      npmInstall := runOperation("npm install", JavaScriptProcess.processBuilder(configDirectory.value, "npm", "install").run().exitValue()),
      runAllTests := runOperation("JavaScript Jest tests", JavaScriptProcess.processBuilder(configDirectory.value, "jest").run().exitValue()),

      runAllTests := {runAllTests dependsOn npmInstall}.value,

      (Test / test) := {(Test / test) dependsOn runAllTests}.value
    )
  }

}
