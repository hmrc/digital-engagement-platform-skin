import sbt.Keys._
import sbt._

/**
 * Settings defined in this file are run as part of the test stage.
 * The webpack bundle setting is integral to the bundle being created when the application runs in production.
 * Previously this setting was included as part of the compile stage, but this caused the bundle to be created multiple times.
 */
object JavaScriptBuild {
  val runAllTests = TaskKey[Int]("runAllTests")
  val npmInstall = TaskKey[Int]("npm-install")
  val webpackBuild = TaskKey[Int]("webpack-build")
  val configDirectory: SettingKey[File] = {
    Compile / baseDirectory
  }

  private def runOperation(operation: String, result: Int): Int = {
    if (result != 0) {
      throw new Exception(s"$operation failed with result $result")
    }
    result
  }

  val npmInstallSetting: Seq[sbt.Def.Setting[_]] = Seq (
      npmInstall :=
        runOperation(
          "npm install",
          JavaScriptProcess.processBuilder(configDirectory.value, "npm", "install").run().exitValue()
        ),

      (Test / test) := {(Test / test) dependsOn npmInstall}.value
  )

  val webpackBundleSetting: Seq[sbt.Def.Setting[_]] = Seq (
    webpackBuild :=
      runOperation(
        "webpack build",
        JavaScriptProcess.nodeProcessBuilder(configDirectory.value, "webpack", "build").run().exitValue()
      ),

    webpackBuild := {webpackBuild dependsOn npmInstall}.value,
    (Test / test) := {(Test / test) dependsOn webpackBuild}.value
  )

  val javaScriptTestSetting: Seq[sbt.Def.Setting[_]] = Seq (
      runAllTests := runOperation(
        "JavaScript Jest tests",
        JavaScriptProcess.nodeProcessBuilder(configDirectory.value, "jest").run().exitValue()
      ),

      runAllTests := {runAllTests dependsOn webpackBuild}.value,

      (Test / test) := {(Test / test) dependsOn runAllTests}.value
  )
}
