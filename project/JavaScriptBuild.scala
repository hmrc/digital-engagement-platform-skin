import sbt.Keys._
import sbt._

object JavaScriptBuild {
  val configDirectory = SettingKey[File]("configDirectory")
  val runAllTests = TaskKey[Int]("runAllTests")
  val npmInstall = TaskKey[Int]("npm-install")
  val bundleJs = TaskKey[Int]("bundleJs")
  val ciApiBundleJs = TaskKey[Int]("ciApiBundleJs")

  private def runOperation(operation: String, result: Int): Int = {
    if (result != 0) {
      throw new Exception(s"$operation failed with result $result")
    }
    result
  }

  val javaScriptTestRunnerHook: Seq[sbt.Def.Setting[_]] = Seq(
    configDirectory := {
      baseDirectory in Compile
    }.value,

    npmInstall := runOperation("npm install", Gulp.npmProcess(configDirectory.value, "install").run().exitValue()),
    runAllTests := runOperation("JavaScript Jest tests", Gulp.gulpProcess(configDirectory.value, "jest").run().exitValue()),

    runAllTests := {runAllTests dependsOn npmInstall}.value,

    (test in Test) := {(test in Test) dependsOn runAllTests}.value
  )

  val javaScriptBundler: Seq[sbt.Def.Setting[_]] = Seq(
    configDirectory := {
      baseDirectory in Compile
    }.value,

    bundleJs := runOperation("JS bundling", Gulp.gulpProcess(configDirectory.value, "bundle").run().exitValue()),

    (compile in Compile) :=  {(compile in Compile) dependsOn bundleJs}.value
  )

  val ciApiJavaScriptBundler: Seq[sbt.Def.Setting[_]] = Seq(
    configDirectory := {
      baseDirectory in Compile
      }.value,

    ciApiBundleJs := runOperation("CI API UI JS bundling", Gulp.gulpProcess(configDirectory.value, "bundle_ci_api").run().exitValue()),

    (compile in Compile) :=  {(compile in Compile) dependsOn ciApiBundleJs}.value
  )

}
