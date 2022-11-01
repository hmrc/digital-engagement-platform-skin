import sbt.Keys._
import sbt._

object JavaScriptBuild {
  val configDirectory = SettingKey[File]("configDirectory")
  val runAllTests = TaskKey[Int]("runAllTests")
  val npmInstall = TaskKey[Int]("npm-install")
  val webpackBuild = TaskKey[Int]("webpack-build")

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
      webpackBuild := runOperation("webpack build", JavaScriptProcess.webpackProcess(configDirectory.value,  "build").run().exitValue()),

      runAllTests := {runAllTests dependsOn npmInstall}.value,

      webpackBuild := {webpackBuild dependsOn runAllTests}.value,

      (Test / test) := {(Test / test) dependsOn webpackBuild}.value
    )
  }

}
